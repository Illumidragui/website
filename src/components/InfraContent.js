import React from 'react';
import { useLang } from '@site/src/context/LangContext';
import CodeBlock from '@theme/CodeBlock';

const ARCH_DIAGRAM = `┌─────────────────────────────────────────────────────────────────┐
│  Developer machine (WSL2)                                       │
│                                                                 │
│  terraform apply ──────────────────────────────────────────┐   │
│  kubectl / helm  ──── Tailscale VPN ──────────────────┐    │   │
└──────────────────────────────────────────────────────--|----│---┘
                                                        │    │
                      ┌─────────────────────────────────│----│──────────────────┐
                      │  AWS (us-east-1)                │    │                  │
                      │                                 │    │                  │
                      │  ┌──────────────────────────────▼────▼────────────┐    │
                      │  │  VPC  10.0.0.0/16                              │    │
                      │  │                                                 │    │
                      │  │  ┌─────────────────┐                           │    │
                      │  │  │  Public subnet   │                           │    │
                      │  │  │  10.0.0.0/24    │                           │    │
                      │  │  │  NAT Gateway     │                           │    │
                      │  │  │  Internet GW     │                           │    │
                      │  │  └────────┬────────┘                           │    │
                      │  │           │ outbound only                       │    │
                      │  │  ┌────────▼────────────────────────┐           │    │
                      │  │  │  Private subnet  10.0.1.0/24   │           │    │
                      │  │  │                                  │           │    │
                      │  │  │  EC2 t3.medium (no public IP)   │           │    │
                      │  │  │  ├── Tailscale (VPN node) ◄─────────────────┘   │
                      │  │  │  └── k3s (Kubernetes)            │           │    │
                      │  │  │       ├── argo-cd                │           │    │
                      │  │  │       ├── ingress-nginx           │           │    │
                      │  │  │       ├── cert-manager            │           │    │
                      │  │  │       ├── tailscale-operator      │           │    │
                      │  │  │       └── syesite                 │           │    │
                      │  │  └─────────────────────────────────┘           │    │
                      │  └─────────────────────────────────────────────────┘    │
                      │                                                          │
                      │  S3 bucket: devsecops-infra-tfstate                     │
                      │  (Terraform remote state)                                │
                      └──────────────────────────────────────────────────────────┘`;

const REPO_TREE = `kuberlab/
├── devsecops-infra/          # Terraform — provisions AWS + deploys ArgoCD
│   ├── main.tf               # Root: provider config + module wiring
│   ├── variables.tf          # Input variable declarations
│   ├── locals.tf             # Common tags, name prefixes
│   ├── outputs.tf            # instance_ip, tailscale_hostname
│   ├── backend.tf            # S3 remote state
│   ├── terraform.tfvars      # Secret values — gitignored
│   └── tf-modules/
│       ├── aws-vpc/          # VPC, subnets, NAT Gateway, route tables
│       ├── aws-ec2/          # EC2 instance, security group, k3s via user_data
│       └── helm-argocd/      # ArgoCD + App of Apps via Helm provider
│
├── devsecops-helm/           # Helm charts — managed by ArgoCD
│   ├── cert-manager-clusterissuer/
│   ├── ingress-nginx/
│   ├── tailscale-operator/
│   └── syesite-chart/
│
└── argocd-app-of-apps/       # GitOps source — defines all ArgoCD Applications
    ├── Chart.yaml
    └── values.yaml           # One entry per managed application`;

const PHASE1_CMD = `cd devsecops-infra
terraform init
terraform apply -target=module.vpc -target=module.ec2 -var-file=terraform.tfvars`;

const KUBECONFIG_CMD = `TAILSCALE_IP=<ip-from-tailscale-admin>
ssh ec2-user@$TAILSCALE_IP "sudo cat /etc/rancher/k3s/k3s.yaml" \\
  | sed "s/127.0.0.1/$TAILSCALE_IP/g" > ~/.kube/devsecops-config
export KUBECONFIG=~/.kube/devsecops-config
kubectl get nodes  # should show Ready`;

const PHASE2_CMD = `terraform apply -var-file=terraform.tfvars`;

const DESTROY_CMD = `terraform destroy -var-file=terraform.tfvars

# Redeploy
terraform apply -target=module.vpc -target=module.ec2 -var-file=terraform.tfvars
# (copy kubeconfig — new instance = new Tailscale IP)
terraform apply -var-file=terraform.tfvars`;

const content = {
  en: {
    title: 'KuberLab — Personal DevOps Lab on AWS',
    subtitle: 'CLOUD INFRASTRUCTURE',
    intro: 'A personal infrastructure lab for learning Kubernetes, ArgoCD, Helm, and Terraform in a production-realistic setup. The goal is to deploy and destroy the full stack repeatedly to build operational intuition — not just theory.',

    whatTitle: 'What it does',
    what: 'Provisions a complete Kubernetes platform on AWS using Terraform, then hands off application deployment to ArgoCD via GitOps. Everything is accessible over Tailscale VPN — no public IP anywhere on the cluster.',

    archTitle: 'Architecture',

    repoTitle: 'Repository structure',
    repoIntro: 'The project is split across three Git repositories:',

    stackTitle: 'Stack',
    stackHeaders: ['Layer', 'Technology', 'Purpose'],
    stackRows: [
      ['Cloud', 'AWS', 'VPC, EC2, NLB, S3'],
      ['Infrastructure as Code', 'Terraform', 'Provisions all AWS resources'],
      ['Kubernetes', 'k3s', 'Lightweight single-node cluster'],
      ['VPN', 'Tailscale', 'Zero-config secure access, no public IP needed'],
      ['Package manager', 'Helm', 'Deploys ArgoCD and applications'],
      ['GitOps', 'ArgoCD', 'Continuous sync of cluster state from Git'],
      ['Ingress', 'ingress-nginx', 'HTTP/HTTPS routing inside the cluster'],
      ['TLS', 'cert-manager + Let\'s Encrypt', 'Automatic SSL certificate provisioning'],
      ['State backend', 'S3', 'Remote Terraform state with AES256 encryption'],
    ],

    deployTitle: 'How it is deployed',
    deployIntro: "Deployment happens in two phases because Terraform's Helm provider needs a working kubeconfig, which only exists after Phase 1 creates the EC2 + k3s node.",

    phase1Title: 'Phase 1 — Network + Compute',
    phase1Creates: 'Terraform creates:',
    phase1Items: [
      'VPC with public/private subnets, NAT Gateway, Internet Gateway, route tables',
      'EC2 instance in the private subnet',
      <>EC2 <code>user_data</code> script runs on first boot: installs Tailscale (joins VPN), installs k3s with the Tailscale IP as TLS SAN, disables Traefik</>,
    ],
    phase1Note: 'Once the node appears in the Tailscale admin panel, copy the kubeconfig:',

    phase2Title: 'Phase 2 — Kubernetes platform',
    phase2Intro: 'Terraform deploys via Helm:',
    phase2Items: [
      <><strong>ingress-nginx</strong> — creates an AWS Network Load Balancer</>,
      <><strong>argo-cd</strong> — ArgoCD control plane</>,
      <><strong>argocd-apps</strong> — the App of Apps chart, pointing to the GitOps repo</>,
    ],
    phase2Note: <>From this point ArgoCD takes over. All applications have <code>automated: prune: true, selfHeal: true</code> — any drift from Git is corrected automatically.</>,

    decisionsTitle: 'Key design decisions',
    decisions: [
      {
        title: 'create flag per module',
        body: <>Each Terraform module accepts a <code>create = bool</code> variable. Setting it to <code>false</code> skips all resource creation without removing the module call from <code>main.tf</code>. This is how the two-phase deployment is orchestrated without separate workspaces.</>,
      },
      {
        title: 'Providers inside the child module',
        body: <>The <code>kubernetes</code> and <code>helm</code> providers are declared inside <code>tf-modules/helm-argocd/main.tf</code>, not in the root. This makes the module self-contained and avoids circular dependency issues, but means <code>depends_on</code> cannot be used on it — ordering is handled by the <code>create</code> flag and <code>-target</code> on first run.</>,
      },
      {
        title: 'No public IP on EC2',
        body: 'The EC2 node lives in the private subnet. The only way in is through Tailscale. The security group allows all VPC-internal traffic and all outbound, but no public inbound at all.',
      },
      {
        title: 'App of Apps pattern',
        body: <>ArgoCD is bootstrapped with a single Helm release (<code>argocd-apps</code>) that points to the GitOps repo. That repo defines all other applications. Adding a new app means adding one entry to <code>argocd-app-of-apps/values.yaml</code> and pushing — ArgoCD picks it up automatically.</>,
      },
      {
        title: 'Dynamic AMI lookup',
        body: <>The EC2 module uses a <code>data "aws_ami"</code> block to always fetch the latest Amazon Linux 2023 AMI. No hardcoded AMI IDs that would break across regions or go stale.</>,
      },
    ],

    stateTitle: 'Current state',
    stateHeaders: ['Component', 'Status'],
    stateRows: [
      ['VPC + subnets + NAT Gateway', 'Deployed'],
      ['EC2 t3.medium + k3s', 'Deployed, node Ready'],
      ['Tailscale node-level access', 'Working'],
      ['ArgoCD', 'Running, App of Apps synced'],
      ['ingress-nginx', 'Running'],
      ['cert-manager + ClusterIssuer', 'Synced'],
      ['syesite (portfolio app)', 'Running — pending domain DNS config'],
      ['tailscale-operator', 'OutOfSync — OAuth credentials not yet configured'],
    ],
    pendingTitle: 'Pending',
    pending: [
      <>Point <code>shengjunye.me</code> DNS A record to the NLB external IP</>,
      'Configure Tailscale OAuth credentials for the in-cluster operator',
      'Plan migration to Oracle Cloud Free Tier (same architecture, different provider modules)',
    ],

    destroyTitle: 'Destroy and redeploy',
    destroyNote: 'The lab is designed to be torn down and rebuilt repeatedly. The S3 state bucket survives destroy — the next terraform init picks up where it left off.',

    learnedTitle: 'What I learned building this',
    learned: [
      'How Terraform modules are composed and how provider scoping affects dependency management',
      'Why a two-phase deployment is necessary when a provider depends on infrastructure created in the same apply',
      'How the App of Apps pattern works in ArgoCD and why it scales better than managing applications individually',
      'How Tailscale eliminates the need for bastion hosts, VPNs, or public IPs for lab access',
      'The resource constraints of single-node Kubernetes (and why t2.micro is not enough for a real workload)',
      'How cert-manager automates TLS certificate lifecycle with Let\'s Encrypt',
    ],

    plannedTitle: 'Planned improvements',
    planned: [
      <>Migrate to Oracle Cloud Free Tier (always-free <code>VM.Standard.A1.Flex</code> — 4 OCPU / 24 GB RAM)</>,
      'Separate Phase 1 and Phase 2 into independent Terraform directories to avoid provider initialization issues on fresh deploys',
      'Add a shell script to automate the kubeconfig copy step',
      'Add Prometheus + Grafana for observability',
      'Configure network policies to restrict pod-to-pod traffic',
    ],
  },

  es: {
    title: 'KuberLab — Laboratorio Personal de DevOps en AWS',
    subtitle: 'INFRAESTRUCTURA CLOUD',
    intro: 'Un laboratorio de infraestructura personal para aprender Kubernetes, ArgoCD, Helm y Terraform en una configuración realista de producción. El objetivo es desplegar y destruir el stack completo repetidamente para construir intuición operacional — no solo teoría.',

    whatTitle: 'Qué hace',
    what: 'Provisiona una plataforma Kubernetes completa en AWS usando Terraform, y delega el despliegue de aplicaciones a ArgoCD mediante GitOps. Todo es accesible a través de Tailscale VPN — sin ninguna IP pública en el clúster.',

    archTitle: 'Arquitectura',

    repoTitle: 'Estructura del repositorio',
    repoIntro: 'El proyecto se divide en tres repositorios Git:',

    stackTitle: 'Stack',
    stackHeaders: ['Capa', 'Tecnología', 'Propósito'],
    stackRows: [
      ['Cloud', 'AWS', 'VPC, EC2, NLB, S3'],
      ['Infraestructura como Código', 'Terraform', 'Provisiona todos los recursos de AWS'],
      ['Kubernetes', 'k3s', 'Clúster ligero de un solo nodo'],
      ['VPN', 'Tailscale', 'Acceso seguro sin configuración, sin IP pública'],
      ['Gestor de paquetes', 'Helm', 'Despliega ArgoCD y aplicaciones'],
      ['GitOps', 'ArgoCD', 'Sincronización continua del estado del clúster desde Git'],
      ['Ingress', 'ingress-nginx', 'Enrutamiento HTTP/HTTPS dentro del clúster'],
      ['TLS', 'cert-manager + Let\'s Encrypt', 'Provisión automática de certificados SSL'],
      ['Estado remoto', 'S3', 'Estado remoto de Terraform con cifrado AES256'],
    ],

    deployTitle: 'Cómo se despliega',
    deployIntro: 'El despliegue ocurre en dos fases porque el provider Helm de Terraform necesita un kubeconfig funcional, que solo existe después de que la Fase 1 crea el EC2 + nodo k3s.',

    phase1Title: 'Fase 1 — Red + Cómputo',
    phase1Creates: 'Terraform crea:',
    phase1Items: [
      'VPC con subnets públicas/privadas, NAT Gateway, Internet Gateway, tablas de rutas',
      'Instancia EC2 en la subnet privada',
      <>El script <code>user_data</code> se ejecuta en el primer arranque: instala Tailscale (se une a la VPN), instala k3s con la IP de Tailscale como TLS SAN, deshabilita Traefik</>,
    ],
    phase1Note: 'Una vez que el nodo aparece en el panel de administración de Tailscale, copia el kubeconfig:',

    phase2Title: 'Fase 2 — Plataforma Kubernetes',
    phase2Intro: 'Terraform despliega mediante Helm:',
    phase2Items: [
      <><strong>ingress-nginx</strong> — crea un Network Load Balancer de AWS</>,
      <><strong>argo-cd</strong> — plano de control de ArgoCD</>,
      <><strong>argocd-apps</strong> — el chart App of Apps, apuntando al repo de GitOps</>,
    ],
    phase2Note: <>A partir de este punto ArgoCD toma el control. Todas las aplicaciones tienen <code>automated: prune: true, selfHeal: true</code> — cualquier deriva respecto a Git se corrige automáticamente.</>,

    decisionsTitle: 'Decisiones clave de diseño',
    decisions: [
      {
        title: 'Flag create por módulo',
        body: <>Cada módulo Terraform acepta una variable <code>create = bool</code>. Configurarla a <code>false</code> omite toda la creación de recursos sin eliminar la llamada al módulo de <code>main.tf</code>. Así se orquesta el despliegue en dos fases sin workspaces separados.</>,
      },
      {
        title: 'Providers dentro del módulo hijo',
        body: <>Los providers <code>kubernetes</code> y <code>helm</code> se declaran dentro de <code>tf-modules/helm-argocd/main.tf</code>, no en la raíz. Esto hace el módulo autónomo y evita problemas de dependencia circular, pero significa que <code>depends_on</code> no puede usarse en él — el orden se gestiona con el flag <code>create</code> y <code>-target</code> en la primera ejecución.</>,
      },
      {
        title: 'Sin IP pública en EC2',
        body: 'El nodo EC2 vive en la subnet privada. La única vía de acceso es a través de Tailscale. El grupo de seguridad permite todo el tráfico interno de la VPC y todo el tráfico saliente, pero ningún tráfico público entrante.',
      },
      {
        title: 'Patrón App of Apps',
        body: <>ArgoCD se inicializa con una única release de Helm (<code>argocd-apps</code>) que apunta al repo de GitOps. Ese repo define todas las demás aplicaciones. Añadir una nueva app significa añadir una entrada en <code>argocd-app-of-apps/values.yaml</code> y hacer push — ArgoCD la detecta automáticamente.</>,
      },
      {
        title: 'Búsqueda dinámica de AMI',
        body: <>El módulo EC2 usa un bloque <code>data "aws_ami"</code> para obtener siempre el último AMI de Amazon Linux 2023. Sin IDs de AMI hardcodeados que se romperían entre regiones o quedarían obsoletos.</>,
      },
    ],

    stateTitle: 'Estado actual',
    stateHeaders: ['Componente', 'Estado'],
    stateRows: [
      ['VPC + subnets + NAT Gateway', 'Desplegado'],
      ['EC2 t3.medium + k3s', 'Desplegado, nodo Ready'],
      ['Acceso a nivel de nodo por Tailscale', 'Funcionando'],
      ['ArgoCD', 'Funcionando, App of Apps sincronizado'],
      ['ingress-nginx', 'Funcionando'],
      ['cert-manager + ClusterIssuer', 'Sincronizado'],
      ['syesite (app de portfolio)', 'Funcionando — pendiente config DNS'],
      ['tailscale-operator', 'OutOfSync — credenciales OAuth no configuradas'],
    ],
    pendingTitle: 'Pendiente',
    pending: [
      <>Apuntar el registro DNS A de <code>shengjunye.me</code> a la IP externa del NLB</>,
      'Configurar credenciales OAuth de Tailscale para el operador en el clúster',
      'Planificar migración a Oracle Cloud Free Tier (misma arquitectura, diferentes módulos de provider)',
    ],

    destroyTitle: 'Destruir y redesplegar',
    destroyNote: 'El laboratorio está diseñado para ser destruido y reconstruido repetidamente. El bucket S3 de estado sobrevive al destroy — el próximo terraform init retoma donde lo dejó.',

    learnedTitle: 'Qué aprendí construyendo esto',
    learned: [
      'Cómo se componen los módulos Terraform y cómo el alcance de los providers afecta la gestión de dependencias',
      'Por qué un despliegue en dos fases es necesario cuando un provider depende de infraestructura creada en el mismo apply',
      'Cómo funciona el patrón App of Apps en ArgoCD y por qué escala mejor que gestionar las aplicaciones individualmente',
      'Cómo Tailscale elimina la necesidad de hosts bastión, VPNs o IPs públicas para el acceso al laboratorio',
      'Las restricciones de recursos de Kubernetes de un solo nodo (y por qué t2.micro no es suficiente para una carga real)',
      'Cómo cert-manager automatiza el ciclo de vida de los certificados TLS con Let\'s Encrypt',
    ],

    plannedTitle: 'Mejoras planificadas',
    planned: [
      <>Migrar a Oracle Cloud Free Tier (siempre gratuito <code>VM.Standard.A1.Flex</code> — 4 OCPU / 24 GB RAM)</>,
      'Separar la Fase 1 y Fase 2 en directorios Terraform independientes para evitar problemas de inicialización de providers en despliegues nuevos',
      'Añadir un script de shell para automatizar el paso de copia del kubeconfig',
      'Añadir Prometheus + Grafana para observabilidad',
      'Configurar políticas de red para restringir el tráfico pod a pod',
    ],
  },
};

function DataTable({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default function InfraContent() {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <div>
      <p>{c.intro}</p>

      <h2>{c.whatTitle}</h2>
      <p>{c.what}</p>

      <h2>{c.archTitle}</h2>
      <CodeBlock language="text">{ARCH_DIAGRAM}</CodeBlock>

      <h2>{c.repoTitle}</h2>
      <p>{c.repoIntro}</p>
      <CodeBlock language="text">{REPO_TREE}</CodeBlock>

      <h2>{c.stackTitle}</h2>
      <DataTable headers={c.stackHeaders} rows={c.stackRows} />

      <h2>{c.deployTitle}</h2>
      <p>{c.deployIntro}</p>

      <h3>{c.phase1Title}</h3>
      <CodeBlock language="bash">{PHASE1_CMD}</CodeBlock>
      <p><strong>{c.phase1Creates}</strong></p>
      <ol>{c.phase1Items.map((item, i) => <li key={i}>{item}</li>)}</ol>
      <p>{c.phase1Note}</p>
      <CodeBlock language="bash">{KUBECONFIG_CMD}</CodeBlock>

      <h3>{c.phase2Title}</h3>
      <CodeBlock language="bash">{PHASE2_CMD}</CodeBlock>
      <p><strong>{c.phase2Intro}</strong></p>
      <ol>{c.phase2Items.map((item, i) => <li key={i}>{item}</li>)}</ol>
      <p>{c.phase2Note}</p>

      <h2>{c.decisionsTitle}</h2>
      {c.decisions.map((d, i) => (
        <div key={i}>
          <h3>{d.title}</h3>
          <p>{d.body}</p>
        </div>
      ))}

      <h2>{c.destroyTitle}</h2>
      <p>{c.destroyNote}</p>
      <CodeBlock language="bash">{DESTROY_CMD}</CodeBlock>

      <h2>{c.stateTitle}</h2>
      <DataTable headers={c.stateHeaders} rows={c.stateRows} />
      <p><strong>{c.pendingTitle}</strong></p>
      <ul>{c.pending.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h2>{c.learnedTitle}</h2>
      <ul>{c.learned.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h2>{c.plannedTitle}</h2>
      <ul>{c.planned.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}
