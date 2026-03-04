# Proxy

WUD supports routing all outbound HTTP/HTTPS requests through a proxy server using standard environment variables.

This is useful in corporate or enterprise environments where internet access is only available through an HTTP proxy (e.g. CNTLM, Squid).

WUD uses proper **CONNECT tunneling** for HTTPS targets, ensuring reliable connections through HTTP proxies.

#### Variables

| Env var       |    Required    | Description                                                      | Supported values                            | Default value when missing |
|---------------|:--------------:|------------------------------------------------------------------|---------------------------------------------|----------------------------|
| `HTTP_PROXY`  | :white_circle: | Proxy URL for HTTP requests                                      | `http://host:port`                          |                            |
| `HTTPS_PROXY` | :white_circle: | Proxy URL for HTTPS requests (falls back to `HTTP_PROXY` if unset)| `http://host:port`                          |                            |
| `NO_PROXY`    | :white_circle: | Comma-separated list of hostnames or domains to bypass the proxy | `localhost,127.0.0.1,.internal.corp`        |                            |

?> Lowercase variants (`http_proxy`, `https_proxy`, `no_proxy`) are also supported.

#### Scope

When set, these variables apply globally to **all outbound requests** made by WUD, including:
- All **registry** API calls (Docker Hub, ECR, GCR, GHCR, GitLab, Gitea, Quay, and custom registries)
- All **trigger** HTTP calls (HTTP, Apprise, Discord, IFTTT, Ntfy, Rocket.Chat)

#### NO_PROXY behaviour

The `NO_PROXY` variable accepts a comma-separated list of entries. A request bypasses the proxy when:
- The target hostname **exactly matches** an entry (e.g. `registry.example.com`)
- The target hostname **ends with** an entry (e.g. `auth.docker.io` matches `docker.io`)
- The entry is `*` (wildcard — disables proxy for all requests)

### Examples

#### Route all requests through a corporate proxy

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: ghcr.io/regix1/wud
    ...
    environment:
      - HTTP_PROXY=http://proxy.corp.local:8080
      - HTTPS_PROXY=http://proxy.corp.local:8080
      - NO_PROXY=localhost,127.0.0.1
```
#### **Docker**
```bash
docker run \
  -e HTTP_PROXY="http://proxy.corp.local:8080" \
  -e HTTPS_PROXY="http://proxy.corp.local:8080" \
  -e NO_PROXY="localhost,127.0.0.1" \
  ...
  ghcr.io/regix1/wud
```
<!-- tabs:end -->

#### Use a CNTLM sidecar container as proxy

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: ghcr.io/regix1/wud
    ...
    environment:
      - HTTP_PROXY=http://cntlm:3128
      - HTTPS_PROXY=http://cntlm:3128
    depends_on:
      - cntlm

  cntlm:
    image: robertdebock/docker-cntlm
    ...
```
<!-- tabs:end -->

#### Bypass proxy for internal registries

<!-- tabs:start -->
#### **Docker Compose**
```yaml
services:
  whatsupdocker:
    image: ghcr.io/regix1/wud
    ...
    environment:
      - HTTP_PROXY=http://proxy:8080
      - HTTPS_PROXY=http://proxy:8080
      - NO_PROXY=registry.internal.corp,192.168.1.100
```
<!-- tabs:end -->
