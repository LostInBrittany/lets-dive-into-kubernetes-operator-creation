### Building the container

```sh
podman build -t lostinbrittany/random-gopher:0.0.4 .
podman login
podman push lostinbrittany/random-gopher:0.0.4
```


## Deploying `random-gopher-deployment`

### Deploying the manifest

```sh
kubectl apply -f manifests random-gopher-deployment.yaml
```

### Getting pods' adress

```sh
kubectl get pods -o wide
```

### Create a busybox

```sh
kubectl run -i --tty --rm debug --image=busybox --restart=Never -- sh
```

### Asking for a Gopher name

```sh
wget -qO - [pod_ip]:8080/gopher/name
```

---

## Gopher API and UI

### Gopher example

```json
{
  "id": "gopher-1234",
  "name": "5th-element",
  "displayname": "5th Element",
  "url": "https://github.com/scraly/gophers/blob/main/5th-element.png?raw=true"
}
```

---

