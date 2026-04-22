---
slug: kuberlab-personal-devops-lab
title: "KuberLab: Building a Personal DevOps Lab on AWS"
authors: [kuberlab]
tags: [kubernetes, terraform, argocd, helm, gitops, tailscale, k3s, aws, devops]
---

A personal infrastructure lab for learning Kubernetes, ArgoCD, Helm, and Terraform in a production-realistic setup. The goal: deploy and destroy the full stack repeatedly to build operational intuition — not just theory.

The live result: **https://shengjunye.me** — a portfolio site deployed automatically via GitOps every time code is pushed to GitHub.

<!-- truncate -->

## Why build this instead of using a managed service?

Most tutorials deploy to managed Kubernetes (EKS, GKE) or skip infrastructure entirely. This project takes the harder path on purpose:

- **Terraform from scratch** — VPC, subnets, route tables, NAT gateway, EC2, Elastic IP. Every AWS resource is explicit and understood, not hidden behind a managed service.
- **k3s instead of EKS** — EKS costs $72/month just for the control plane. k3s on a single t3.medium costs ~$30/month and teaches the same operational concepts.
- **Tailscale for internal access** — eliminates bastion hosts and complex security group rules. The k3s API server is never exposed publicly.
- **ArgoCD + GitOps** — application deployments are driven by Git, not manual `kubectl apply`. This mirrors how production deployments work at most companies.
- **Designed to be destroyed** — the lab is torn down and rebuilt repeatedly. Muscle memory over reference docs.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Developer machine (WSL2)                                       │
│                                                                 │
│  terraform apply ──────────────────────────────────────────┐   │
│  kubectl / helm  ──── Tailscale VPN ──────────────────┐    │   │
└──────────────────────────────────────────────────────--|----│---┘
                                                        │    │
                      ┌─────────────────────────────────│────│──────────────────┐
                      │  AWS (us-east-1)                │    │                  │
                      │                                 │    │                  │
                      │  ┌──────────────────────────────▼────▼────────────┐    │
                      │  │  VPC  10.0.0.0/16                               │    │
                      │  │                                                  │    │
                      │  │  ┌──────────────────────────────────┐           │    │
                      │  │  │  Public subnet  10.0.0.0/24      │           │    │
                      │  │  │  Internet Gateway                 │           │    │
                      │  │  │                                   │           │    │
                      │  │  │  EC2 t3.medium                   │           │    │
                      │  │  │  Elastic IP (static public IP)   │           │    │
                      │  │  │  ├── Tailscale (VPN node)        │           │    │
                      │  │  │  └── k3s (Kubernetes)            │           │    │
                      │  │  │       ├── argo-cd                │           │    │
                      │  │  │       ├── ingress-nginx           │           │    │
                      │  │  │       ├── cert-manager            │           │    │
                      │  │  │       ├── tailscale-operator      │           │    │
                      │  │  │       └── syesite                 │           │    │
                      │  │  └──────────────────────────────────┘           │    │
                      │  └──────────────────────────────────────────────────┘    │
                      │                                                           │
                      │   Internet (HTTPS :443 / HTTP :80)                       │
                      │   shengjunye.me ──► Elastic IP                           │
                      │   (DNS A record via Porkbun, proxied through Cloudflare) │
                      │                                                           │
                      │  S3 bucket: devsecops-infra-tfstate (Terraform state)   │
                      └───────────────────────────────────────────────────────────┘
```

**Traffic flow for shengjunye.me:**
1. Browser hits Cloudflare → Cloudflare proxies to the Elastic IP
2. Elastic IP → EC2 → ingress-nginx (port 80/443)
3. ingress-nginx routes to the `syeapp` pod
4. TLS terminated by cert-manager (Let's Encrypt cert)

**Internal access (kubectl, ArgoCD UI):** only reachable via Tailscale VPN — k3s API port 6443 is blocked to the public internet.

## The stack

| Layer | Technology | Purpose |
|---|---|---|
| Cloud | AWS | VPC, EC2, Elastic IP, S3 |
| Infrastructure as Code | Terraform | Provisions all AWS resources |
| Kubernetes | k3s | Lightweight single-node cluster on EC2 |
| VPN | Tailscale | Zero-config VPN — internal access only |
| Package manager | Helm | Deploys ArgoCD and all applications |
| GitOps | ArgoCD | Continuous sync of cluster state from Git |
| Ingress | ingress-nginx | HTTP/HTTPS routing inside the cluster |
| TLS | cert-manager + Let's Encrypt | Automatic certificate provisioning via HTTP01 |
| DNS | Porkbun | Domain registrar for shengjunye.me |
| CDN / Proxy | Cloudflare | Proxies traffic to the Elastic IP |
| State backend | S3 | Remote Terraform state with AES256 encryption |
| Site framework | Docusaurus | Portfolio site — static build, served via nginx |

## Repository structure

```
kuberlab/
├── devsecops-infra/          # Terraform — provisions AWS + deploys ArgoCD
│   ├── main.tf               # Root: provider config + module wiring
│   ├── variables.tf
│   ├── outputs.tf            # public_ip, tailscale_hostname
│   ├── backend.tf            # S3 remote state
│   ├── terraform.tfvars      # Secret values — gitignored
│   └── tf-modules/
│       ├── aws-vpc/          # VPC, public subnet, NAT Gateway, route tables
│       ├── aws-ec2/          # EC2, Elastic IP, security group, k3s via user_data
│       └── helm-argocd/      # ArgoCD + App of Apps via Helm provider
│
├── devsecops-helm/           # Helm charts — managed by ArgoCD
│   ├── cert-manager-clusterissuer/
│   ├── ingress-nginx/
│   ├── tailscale-operator/
│   └── syesite-chart/        # Personal portfolio Helm chart
│
└── argocd-app-of-apps/       # GitOps source — defines all ArgoCD Applications
    ├── Chart.yaml
    └── values.yaml           # One entry per managed application
```

## How deployment works

Deployment happens in two phases because Terraform's Helm provider needs a working kubeconfig, which only exists after Phase 1 creates the EC2 and k3s installs itself.

### Phase 1 — Network + Compute

```bash
cd devsecops-infra
terraform init
terraform apply -target=module.vpc -target=module.ec2 -var-file=terraform.tfvars
```

Terraform creates:
1. VPC with public subnet, NAT Gateway, Internet Gateway, route tables
2. EC2 instance in the public subnet with an Elastic IP
3. EC2 `user_data` script runs on first boot — installs Tailscale, installs k3s with the Tailscale IP as TLS SAN, disables Traefik

Wait for the node to appear in the Tailscale admin panel, then copy the kubeconfig:

```bash
TAILSCALE_IP=<ip-from-tailscale-admin>
scp ec2-user@${TAILSCALE_IP}:/etc/rancher/k3s/k3s.yaml ~/.kube/devsecops-config
sed -i "s/127.0.0.1/${TAILSCALE_IP}/g" ~/.kube/devsecops-config
kubectl get nodes --kubeconfig ~/.kube/devsecops-config  # should show Ready
```

### Phase 2 — Kubernetes platform

```bash
terraform apply -var-file=terraform.tfvars
```

Terraform deploys via Helm:
1. **argo-cd** — ArgoCD control plane
2. **argocd-apps** — the App of Apps chart, pointing to the GitOps repo

From this point ArgoCD takes over. It reads `argocd-app-of-apps/values.yaml` from GitHub and automatically syncs cert-manager, ingress-nginx, tailscale-operator, and syesite. All applications have `automated: prune: true, selfHeal: true` — any drift from Git is corrected automatically.

### Phase 3 — DNS

```bash
terraform output public_ip
```

Set two A records in Porkbun pointing at the Elastic IP. cert-manager detects the Ingress annotation and requests a Let's Encrypt certificate via HTTP01 challenge. Once DNS propagates, the cert is issued and HTTPS is live.

## Key design decisions

### EC2 in public subnet with Elastic IP (not a load balancer)

A Network Load Balancer would add ~$16/month and requires AWS account-level permissions that are restricted on new accounts. An Elastic IP on the EC2 directly achieves the same result for a single-node lab — the IP is static across stop/start cycles and costs nothing when associated.

### Tailscale for internal access only

The k3s API (port 6443) is blocked from the internet via the security group. kubectl and Helm only work from machines connected to the Tailscale network. HTTP/HTTPS (ports 80/443) are open publicly for the website.

### k3s instead of EKS

EKS costs $0.10/hour ($72/month) for the control plane alone, before any EC2. k3s is free and runs on the same EC2 as the workloads. For a personal lab doing frequent destroy/rebuild cycles, this is the difference between $30 and $135/month.

### `create` flag per module

Each Terraform module accepts a `create = bool` variable. Setting it to `false` skips all resource creation without removing the module call from `main.tf`. This enables the two-phase deployment without separate workspaces.

### App of Apps pattern

ArgoCD is bootstrapped with a single Helm release that points to the GitOps repo. That repo defines all other applications. Adding a new app means adding one entry to `values.yaml` and pushing — ArgoCD picks it up automatically.

### Dynamic AMI lookup

The EC2 module uses `data "aws_ami"` to always fetch the latest Amazon Linux 2023 AMI. No hardcoded AMI IDs that go stale or break across regions.

## Current state

| Component | Status |
|---|---|
| VPC + public subnet + Internet Gateway | Deployed |
| EC2 t3.medium + Elastic IP | Deployed, node Ready |
| Tailscale node-level access | Working |
| ArgoCD | Running, App of Apps synced |
| ingress-nginx | Running |
| cert-manager + ClusterIssuer | Synced |
| syesite (portfolio app) | Running, live at https://shengjunye.me |
| TLS certificate (Let's Encrypt) | Issued, READY: True |
| DNS (Porkbun A records) | Configured → Elastic IP |
| Cloudflare proxy | Active |
| tailscale-operator | Progressing — OAuth credentials not yet configured |

## What I learned

- How Terraform modules are composed and how provider scoping affects dependency ordering
- Why a two-phase deployment is necessary when a Helm provider depends on infrastructure created in the same apply
- How the App of Apps pattern works in ArgoCD and why it scales better than managing applications individually
- How Tailscale eliminates bastion hosts, VPNs, and complex security groups for internal access
- Why k3s on EC2 is dramatically cheaper than EKS for personal labs
- How cert-manager automates TLS certificate lifecycle using Let's Encrypt HTTP01 challenges
- The real cost breakdown of AWS services at personal lab scale (NAT Gateway is the hidden cost)

## What's next — cheapest possible public website on AWS

**Goal:** host a static website on the smallest possible AWS footprint, with no Kubernetes.

**Approach:** single `t2.micro` EC2 (free-tier eligible) in a public subnet running Docker. No NAT gateway, no load balancer, no k3s overhead.

```
shengjunye.me (Porkbun A record)
       │
  Cloudflare (proxy + CDN)
       │
  Elastic IP
       │
  EC2 t2.micro — public subnet
  └── Docker
       └── nginx container serving static build
```

**Estimated cost:** ~$0/month on free tier (t2.micro free for 12 months), then ~$8/month after. Compare to the current lab: ~$30-40/month (t3.medium + NAT Gateway when running).

**What changes from the current Terraform:**
- Swap `instance_type = "t3.medium"` → `"t2.micro"`
- Replace `user_data` (k3s install) with Docker install + `docker run nginx`
- Remove the `helm-argocd` module entirely
- Remove the NAT Gateway (EC2 in public subnet has direct internet access)
- Keep the Elastic IP (same DNS setup)
