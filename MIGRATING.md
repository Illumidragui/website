# Migrating from AWS/k3s to Cloudflare Pages

This document describes what AWS infrastructure can be safely decommissioned once
`https://shengjunye.me` is confirmed live on Cloudflare Pages.

---

## New architecture

```
GitHub push to main
       │
GitHub Actions
  ├── npm ci
  ├── npm run build
  └── cloudflare/pages-action
             │
    Cloudflare Pages (CDN edge)
             │
    shengjunye.me (DNS already managed by Cloudflare)
```

No EC2, no containers, no Kubernetes — Cloudflare serves the static build directly
from its edge network, globally, on the free tier.

---

## Pre-decommission checklist

Complete these steps **before** tearing down any AWS resource:

- [ ] Cloudflare Pages project created (`devsecops-v5`) and first deploy succeeded
- [ ] `https://shengjunye.me` loads correctly from Cloudflare Pages
- [ ] DNS A records in Cloudflare updated to point to Pages (remove the Elastic IP target,
      add the `<project>.pages.dev` CNAME or use Cloudflare's custom domain feature)
- [ ] HTTPS/TLS confirmed working (Cloudflare issues the cert automatically)
- [ ] Smoke-test all pages: `/`, `/portfolio`, `/infrastructure`, `/blog`, `/docs/pipeline`

---

## Resources to decommission

### 1. EC2 instance + Elastic IP (highest cost — ~$30-40/month)

The single `t3.medium` node running k3s, ingress-nginx, cert-manager, ArgoCD, and the
site pod. This is the main cost driver.

```bash
cd devsecops-infra
terraform destroy -target=module.ec2 -var-file=terraform.tfvars
```

The Elastic IP is attached to the instance and is released automatically when the instance
is terminated. Verify in the AWS Console that no orphaned Elastic IPs remain (they cost
$3.60/month when unattached).

### 2. VPC and networking (~$0 for idle resources, but cleans up the account)

After EC2 is gone, the VPC, public subnet, Internet Gateway, and route tables can be removed.
If a NAT Gateway was provisioned, destroy it first — it costs ~$32/month regardless of traffic.

```bash
terraform destroy -target=module.vpc -var-file=terraform.tfvars
```

Or destroy everything at once if EC2 is already gone:

```bash
terraform destroy -var-file=terraform.tfvars
```

### 3. ArgoCD (removed with the cluster)

ArgoCD runs inside k3s. It is destroyed automatically when the EC2 instance is terminated.
No separate cleanup needed.

### 4. Helm charts (removed with the cluster)

All workloads managed by ArgoCD — `cert-manager-clusterissuer`, `ingress-nginx`,
`tailscale-operator`, and `syesite-chart` — live inside the cluster and are gone with it.

The chart source files in `devsecops-helm/` can be archived or kept for reference. They
are no longer applied anywhere once the cluster is gone.

### 5. ArgoCD App of Apps repo

The `argocd-app-of-apps` GitHub repository is no longer needed. Archive or delete it after
the cluster is confirmed destroyed.

### 6. Docker Hub images (`illumidragui/syesite`)

Cloudflare Pages builds the static site directly from source — no Docker image is needed.

- Stop the old GitHub Actions workflow in `devsecops-v5` (disable or delete the old
  `deploy.yml` that pushes to Docker Hub and updates the Helm chart)
- Optionally delete the `illumidragui/syesite` repository on Docker Hub to stop accumulating
  image layers

### 7. S3 Terraform state bucket (`devsecops-infra-tfstate`)

Keep this bucket until `terraform destroy` completes successfully. The state file is needed
for Terraform to know what to destroy. After the destroy is confirmed clean, the bucket
can be deleted manually from the AWS Console or with:

```bash
aws s3 rb s3://devsecops-infra-tfstate --force
```

### 8. Tailscale node and keys

Once the EC2 node is gone it will appear as offline in the Tailscale admin panel. Remove it:
- Tailscale Admin → Machines → `lab-kubernetes` → Delete
- Tailscale Admin → Settings → Keys → revoke any unused pre-auth keys

---

## What is NOT decommissioned

| Resource | Reason to keep |
|---|---|
| Cloudflare account | Now serves the site — keep active |
| Porkbun domain (`shengjunye.me`) | Still the domain — keep renewing |
| GitHub repo (`devsecops-v5` / this repo) | Source of truth for the site |
| `devsecops-infra` Terraform repo | Archive for portfolio — safe to keep |
| `devsecops-helm` Helm charts | Archive for portfolio — safe to keep |

---

## DNS cutover (Cloudflare)

Since Cloudflare already proxies `shengjunye.me`, the cutover is a DNS record change
inside the Cloudflare dashboard — no registrar change needed.

**Current state:** A record → Elastic IP of EC2

**Target state:** add a custom domain in Cloudflare Pages:
1. Cloudflare Dashboard → Pages → `devsecops-v5` → Custom domains → Add `shengjunye.me`
2. Cloudflare automatically creates a CNAME pointing to the Pages deployment
3. Remove the old A record pointing to the Elastic IP

Traffic cuts over instantly since Cloudflare controls both the DNS and the origin.

---

## Cost comparison

| Stack | Monthly cost |
|---|---|
| Current (EC2 t3.medium + NAT GW) | ~$30-40/month |
| Cloudflare Pages (free tier) | $0/month |

Cloudflare Pages free tier limits: 500 builds/month, unlimited requests, unlimited bandwidth.
For a personal portfolio this limit will never be reached.
