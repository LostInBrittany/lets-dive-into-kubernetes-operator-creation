### Building the container

```sh
podman build -t lostinbrittany/random-gopher:0.0.4
podman login
podman push lostinbrittany/random-gopher:0.0.4
```

### Create a busybox

```sh
kubectl run -i --tty --rm debug --image=busybox --restart=Never -- sh
```

### Getting pod adresses

```sh
kubectl get pods -o wide
```

### Asking for a Gopher name

```sh
wget -qO - <i>:8080/gopher/name
```




### Gopher example

```json
{
  "id": "gopher-1234",
  "name": "5th-element",
  "displayname": "5th Element",
  "url": "https://github.com/scraly/gophers/blob/main/5th-element.png?raw=true"
}
```