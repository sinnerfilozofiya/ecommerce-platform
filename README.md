# E-Commerce Platform CI/CD & Deployment

This monorepo contains two microservices for a simple e-commerce platform and a full CI/CD pipeline:

- **product-catalog-service**: CRUD REST API for products (Express, MongoDB).  
- **user-management-service**: User registration/login, JWT auth (Express, MongoDB).

---

## 📦 Repository Structure


```shell

ecommerce-platform/
├── .github/
│ └── workflows/ci-cd.yml # GitHub Actions pipeline
├── k8s/
│ ├── staging/ # staging manifests (Deployments & Services)
│ └── prod/ # production manifests
├── docker-compose.yml # local multi-container orchestration
├── product-catalog-service/
│ ├── Dockerfile
│ ├── src/
│ │ ├── index.js
│ │ ├── models/
│ │ └── routes/
│ ├── .env
│ └── package.json
└── user-management-service/
├── Dockerfile
├── src/
│ ├── index.js
│ ├── models/
│ └── routes/
├── .env
└── package.json
```



---

## ⚙️ Prerequisites

- Node.js ≥ 16  
- Docker & Docker Compose  
- Kubernetes cluster (with `kubectl` access)  
- GitHub repository with Secrets:  
  - `REGISTRY_USER`, `REGISTRY_PASSWORD`  
  - `KUBE_CONFIG_STAGING`, `KUBE_CONFIG_PROD` (base64-encoded)  
  - `SLACK_WEBHOOK_URL`  
  - `JWT_SECRET`  

---

## 🛠 1. Local Setup & Run

1. **Clone** this repo and `cd` into it:  
   ```bash
   git clone <repo-url>
   cd ecommerce-platform


### Environment files
### Copy .env.example to each service folder and fill in values:

```bash
cp product-catalog-service/.env.example product-catalog-service/.env
cp user-management-service/.env.example user-management-service/.env
```


Run with Docker Compose

bash
Copy
Edit
docker-compose up --build -d
Product API → http://localhost:3001

User API → http://localhost:3002

Test endpoints

```bash
curl http://localhost:3001/
curl http://localhost:3002/
🚀 2. Docker & Kubernetes
Docker images
Build & tag locally:
```
```bash
docker build -t your-registry/catalog:latest   product-catalog-service
docker build -t your-registry/user-mgmt:latest user-management-service
Push:
```
```bash
docker push your-registry/catalog:latest
docker push your-registry/user-mgmt:latest
Kubernetes
Apply manifests to staging then prod:
```
```bash
kubectl apply -f k8s/staging/
kubectl apply -f k8s/prod/
Each manifest uses:
```
```bash
kind: Deployment
metadata:
  name: <service-name>
  namespace: <staging|production>
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: <service-name>
        image: your-registry/<service-name>:${TAG}
🔄 3. CI/CD Pipeline
File: .github/workflows/ci-cd.yml

build-and-test (on push or PR to develop/main):

Checkout code

npm ci → lint → unit tests → security scan

docker-build-push (on push to branches, not PRs):

Login to registry

Build & tag registry/${service}:${github.sha}

Push image

deploy-staging (after image push):

Load KUBE_CONFIG_STAGING

kubectl set image deployment/${service} ... --namespace=staging

promote-to-prod (on merge to main):

Manual approval via GitHub Environment

Load KUBE_CONFIG_PROD

kubectl set image ... --namespace=production

```