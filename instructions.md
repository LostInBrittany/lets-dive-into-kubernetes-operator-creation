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

