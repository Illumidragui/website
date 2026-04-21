# KuberLab — Personal DevOps Lab on AWS

A personal infrastructure lab for learning Kubernetes, ArgoCD, Helm, and Terraform in a
production-realistic setup. The goal is to deploy and destroy the full stack repeatedly to
build operational intuition — not just theory.

---

## What it does

Provisions a complete Kubernetes platform on AWS using Terraform, then hands off application
deployment to ArgoCD via GitOps. Everything is accessible over Tailscale VPN — no public IP
anywhere on the cluster.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Developer machine (WSL2)                                       │
│                                                                 │
│  terraform apply ──────────────────────────────────────────┐   │
│  kubectl / helm  ──── Tailscale VPN ──────────────────┐    │   │
└──────────────────────────────────────────────────────--|----│---┘
                                                        │    │
                              ┌─────────────────────────│----│──────────────────┐
                              │  AWS (us-east-1)        │    │                  │
                              │                         │    │                  │
                              │  ┌──────────────────────▼────▼────────────┐    │
                              │  │  VPC  10.0.0.0/16                      │    │
                              │  │                                         │    │
                              │  │  ┌─────────────────┐                   │    │
                              │  │  │  Public subnet   │                   │    │
                              │  │  │  10.0.0.0/24    │                   │    │
                              │  │  │  NAT Gateway     │                   │    │
                              │  │  │  Internet GW     │                   │    │
                              │  │  └────────┬────────┘                   │    │
                              │  │           │ outbound only               │    │
                              │  │  ┌────────▼────────────────────────┐   │    │
                              │  │  │  Private subnet  10.0.1.0/24   │   │    │
                              │  │  │                                  │   │    │
                              │  │  │  EC2 t3.medium (no public IP)   │   │    │
                              │  │  │  ├── Tailscale (VPN node) ◄─────────────┘│
                              │  │  │  └── k3s (Kubernetes)            │   │    │
                              │  │  │       ├── argo-cd                │   │    │
                              │  │  │       ├── ingress-nginx           │   │    │
                              │  │  │       ├── cert-manager            │   │    │
                              │  │  │       ├── tailscale-operator      │   │    │
                              │  │  │       └── syesite                 │   │    │
                              │  │  └─────────────────────────────────┘   │    │
                              │  └─────────────────────────────────────────┘    │
                              │                                                  │
                              │  S3 bucket: devsecops-infra-tfstate             │
                              │  (Terraform remote state)                        │
                              └──────────────────────────────────────────────────┘
```

---

## Repository structure

The project is split across three Git repositories:

```
kuberlab/
├── devsecops-infra/          # Terraform — provisions AWS + deploys ArgoCD
│   ├── main.tf               # Root: provider config + module wiring
│   ├── variables.tf          # Input variable declarations
│   ├── locals.tf             # Common tags, name prefixes
│   ├── outputs.tf            # instance_ip, tailscale_hostname
│   ├── backend.tf            # S3 remote state
│   ├── terraform.tfvars      # Secret values — gitignored
│   └── tf-modules/
│       ├── aws-vpc/          # VPC, subnets, NAT Gateway, route tables
│       ├── aws-ec2/          # EC2 instance, security group, k3s install via user_data
│       └── helm-argocd/      # ArgoCD + App of Apps via Helm provider
│           └── helm-values/
│               ├── argo-cd_values.yaml    # ArgoCD Helm overrides
│               └── app-of-apps.yaml       # ArgoCD Application CR template
│
├── devsecops-helm/           # Helm charts — managed by ArgoCD
│   ├── cert-manager-clusterissuer/   # Let's Encrypt ClusterIssuer
│   ├── ingress-nginx/                # NGINX Ingress Controller
│   ├── tailscale-operator/           # In-cluster Tailscale proxy
│   └── syesite-chart/               # Personal portfolio app
│
└── argocd-app-of-apps/       # GitOps source — defines all ArgoCD Applications
    ├── Chart.yaml
    └── values.yaml           # One entry per managed application
```

---

## Stack

| Layer | Technology | Purpose |
|---|---|---|
| Cloud | AWS | VPC, EC2, NLB, S3 |
| Infrastructure as Code | Terraform | Provisions all AWS resources |
| Kubernetes | k3s | Lightweight single-node cluster |
| VPN | Tailscale | Zero-config secure access, no public IP needed |
| Package manager | Helm | Deploys ArgoCD and applications |
| GitOps | ArgoCD | Continuous sync of cluster state from Git |
| Ingress | ingress-nginx | HTTP/HTTPS routing inside the cluster |
| TLS | cert-manager + Let's Encrypt | Automatic SSL certificate provisioning |
| State backend | S3 | Remote Terraform state with AES256 encryption |

---

## How it is deployed

Deployment happens in two phases because Terraform's Helm provider needs a working kubeconfig,
which only exists after Phase 1 creates the EC2 + k3s node.

### Phase 1 — Network + Compute

```bash
cd devsecops-infra
terraform init
terraform apply -target=module.vpc -target=module.ec2 -var-file=terraform.tfvars
```

Terraform creates:
1. VPC with public/private subnets, NAT Gateway, Internet Gateway, route tables
2. EC2 instance in the private subnet
3. EC2 `user_data` script runs on first boot:
   - Installs and starts Tailscale, joins the VPN network using a pre-auth key
   - Installs k3s with the Tailscale IP as TLS SAN (so kubectl works over VPN)
   - Disables Traefik (replaced by ingress-nginx)

Once the node appears in the Tailscale admin panel, copy the kubeconfig:

```bash
TAILSCALE_IP=<ip-from-tailscale-admin>
ssh ec2-user@$TAILSCALE_IP "sudo cat /etc/rancher/k3s/k3s.yaml" \
  | sed "s/127.0.0.1/$TAILSCALE_IP/g" > ~/.kube/devsecops-config
export KUBECONFIG=~/.kube/devsecops-config
kubectl get nodes  # should show Ready
```

### Phase 2 — Kubernetes platform

```bash
terraform apply -var-file=terraform.tfvars
```

Terraform deploys via Helm:
1. **ingress-nginx** — creates an AWS Network Load Balancer
2. **argo-cd** — ArgoCD control plane
3. **argocd-apps** — the App of Apps chart, pointing to the GitOps repo

From this point ArgoCD takes over. It reads `argocd-app-of-apps/values.yaml` from GitHub and
automatically syncs:
- `cert-manager-clusterissuer` → namespace `cert-manager`
- `ingress-nginx` → namespace `ingress-nginx`
- `tailscale-operator` → namespace `tailscale-operator`
- `syesite` → namespace `syesite`

All applications have `automated: prune: true, selfHeal: true` — any drift from Git is
corrected automatically.

---

## Key design decisions

### `create` flag per module
Each Terraform module accepts a `create = bool` variable. Setting it to `false` skips all
resource creation without removing the module call from `main.tf`. This is how the two-phase
deployment is orchestrated without separate workspaces.

### Providers inside the child module
The `kubernetes` and `helm` providers are declared inside `tf-modules/helm-argocd/main.tf`,
not in the root. This makes the module self-contained and avoids circular dependency issues,
but means `depends_on` cannot be used on it — ordering is handled by the `create` flag and
`-target` on first run.

### No public IP on EC2
The EC2 node lives in the private subnet with `associate_public_ip_address = false`. The only
way in is through Tailscale. The security group allows all VPC-internal traffic and all
outbound, but no public inbound at all.

### App of Apps pattern
ArgoCD is bootstrapped with a single Helm release (`argocd-apps`) that points to the GitOps
repo. That repo defines all other applications. Adding a new app means adding an entry to
`argocd-app-of-apps/values.yaml` and pushing — ArgoCD picks it up automatically.

### Dynamic AMI lookup
The EC2 module uses a `data "aws_ami"` block to always fetch the latest Amazon Linux 2023 AMI.
No hardcoded AMI IDs that would break across regions or go stale.

---

## Variables reference

| Variable | Description |
|---|---|
| `aws_region` | AWS region (default: `us-east-1`) |
| `project_name` | Resource name prefix (default: `devsecops`) |
| `environment` | `dev` / `staging` / `prod` |
| `instance_type` | EC2 size (currently `t3.medium`) |
| `ssh_public_key` | SSH public key for EC2 access |
| `tailscale_authkey` | Pre-auth key from tailscale.com/admin/settings/keys |
| `tailscale_hostname` | Node name in Tailscale network |
| `tailscale_oauth_clientid` | OAuth client ID for in-cluster Tailscale operator (optional) |
| `tailscale_oauth_secret` | OAuth secret for in-cluster Tailscale operator (optional) |
| `argocd_github_repo` | URL of the GitOps repo ArgoCD watches |
| `kubeconfig_path` | Local path to kubeconfig (default: `~/.kube/devsecops-config`) |

Sensitive values are stored in `terraform.tfvars` which is gitignored.

---

## Destroy and redeploy

The lab is designed to be torn down and rebuilt repeatedly:

```bash
terraform destroy -var-file=terraform.tfvars

# Redeploy
terraform apply -target=module.vpc -target=module.ec2 -var-file=terraform.tfvars
# (copy kubeconfig — new instance = new Tailscale IP)
terraform apply -var-file=terraform.tfvars
```

The S3 state bucket is not managed by this Terraform, so it survives `destroy` and the next
`terraform init` picks up where it left off.

---

## Current state

| Component | Status |
|---|---|
| VPC + subnets + NAT Gateway | Deployed |
| EC2 t3.medium + k3s | Deployed, node Ready |
| Tailscale node-level access | Working |
| ArgoCD | Running, App of Apps synced |
| ingress-nginx | Running |
| cert-manager + ClusterIssuer | Synced |
| syesite (portfolio app) | Running — pending domain DNS config |
| tailscale-operator | OutOfSync — OAuth credentials not yet configured |

### Pending
- Point `shengjunye.me` DNS A record to the NLB external IP
- Configure Tailscale OAuth credentials for the in-cluster operator
- Plan migration to Oracle Cloud Free Tier (same architecture, different provider modules)

---

## What I learned building this

- How Terraform modules are composed and how provider scoping affects dependency management
- Why a two-phase deployment is necessary when a provider depends on infrastructure created
  in the same apply
- How the App of Apps pattern works in ArgoCD and why it scales better than managing
  applications individually
- How Tailscale eliminates the need for bastion hosts, VPNs, or public IPs for lab access
- The resource constraints of single-node Kubernetes (and why t2.micro is not enough for a
  real workload)
- How cert-manager automates TLS certificate lifecycle with Let's Encrypt

---

## Planned improvements

- Migrate to Oracle Cloud Free Tier (always-free `VM.Standard.A1.Flex` — 4 OCPU / 24 GB RAM)
- Separate Phase 1 and Phase 2 into independent Terraform directories to avoid provider
  initialization issues on fresh deploys
- Add a shell script to automate the kubeconfig copy step
- Add Prometheus + Grafana for observability
- Configure network policies to restrict pod-to-pod traffic
