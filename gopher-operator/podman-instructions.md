### Building the container

```sh
podman login
podman build -t lostinbrittany/gopher-operator:0.0.2 .
podman push lostinbrittany/gopher-operator:0.0.2
```