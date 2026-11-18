# ProductMatch Routing

Decides when an AI product match is safe to act on automatically. Each match is routed to
**approve**, **review** or **block**, and cost-based thresholds are benchmarked against fixed
thresholds through simulation on labelled product-matching data.

A FastAPI backend runs the experiments and serves the results; a React + TypeScript dashboard
shows them.

## Repository layout

```
.
├── backend/                          Python package, API and tests
│   ├── src/productmatch_routing/
│   │   ├── core/                     typed config, logging
│   │   ├── domain/                   Decision, Thresholds, CostModel (pure types)
│   │   ├── data/                     dataset loaders, synthetic data
│   │   ├── features/                 text + semantic similarity
│   │   ├── scoring/                  calibrated confidence model
│   │   ├── routing/                  Router interface, fixed + cost-based routers
│   │   ├── evaluation/               metrics, statistical tests
│   │   ├── experiments/              experiment runner
│   │   ├── api/                      FastAPI app, routes, schemas, repository
│   │   └── cli.py                    `pmr` command
│   ├── tests/{unit,integration}/
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/                         React + TypeScript dashboard (Vite)
│   └── src/{api,components,hooks,lib,pages,styles,types}/
├── configs/                          base.yaml + one file per experiment
├── data/{raw,interim,processed,sample}/   (git-ignored)
├── artifacts/                        experiment outputs (git-ignored)
├── notebooks/                        exploration only, no production logic
├── docs/                             architecture, data policy, ADRs
├── .github/workflows/ci.yml          backend lint + tests, frontend build
├── docker-compose.yml
└── Makefile
```

See [docs/architecture.md](docs/architecture.md) for the design.

## Quick start

Requires Python 3.11+ and Node 20+.

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

make install                   # backend (editable, dev tools) + frontend packages
make sample                    # synthetic development data
make run                       # run the sample experiment -> artifacts/sample/
make test                      # backend tests
make dev                       # API on :8000 + dashboard on http://localhost:5173
```

No `make` (for example on Windows)? Use the commands directly:

```bash
pip install -e "./backend[dev]"
cd frontend && npm install && cd ..
pmr make-sample --out data/sample
pmr run --config configs/experiments/sample.yaml

# terminal 1
pmr serve --reload
# terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173. The badge in the top right shows whether the dashboard can reach
the API.

Or run everything in Docker: `make up`, then open http://localhost:8080.

Run `make help` to see all commands.

## Running a real experiment

1. Download a benchmark into `data/raw/` (see [docs/data.md](docs/data.md)).
2. `make run EXPERIMENT=amazon_google`

To try new costs or thresholds, add a YAML file in `configs/experiments/`. Only the values that
differ from `configs/base.yaml` are needed.

## Semantic (AI) features

Off by default. To enable the local embedding model:

```bash
make install-semantic
# then set features.use_embeddings: true in the experiment config
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Liveness and version |
| GET | `/api/v1/experiments` | Experiments with results |
| GET | `/api/v1/experiments/{name}/summary` | Metrics per router (averaged over seeds) |
| GET | `/api/v1/experiments/{name}/pairs?router=&decision=&limit=&offset=` | Scored pairs with decisions |

Interactive docs: http://localhost:8000/docs

## Outputs

Each run writes to `artifacts/<experiment>/`:

| File | Contents |
|---|---|
| `summary.csv` | One row per (seed, router) with all metrics |
| `comparisons.csv` | McNemar + bootstrap CIs, cost-based vs each fixed router |
| `comparisons_across_seeds.csv` | Wilcoxon tests across seeds |
| `pairs.csv` | Test pairs with confidence and every router's decision |
| `config.yaml`, `run.json` | Exact config and run metadata, for reproducibility |

## Data policy

Raw data, partner data and artifacts are never committed. Partner data never goes to external
AI services. See [docs/data.md](docs/data.md).
