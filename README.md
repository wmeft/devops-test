# DevOps Test microservice

This repo contains a microservice application (Blog application).

It contain multi section to deploy the kubernetes cluster and all microservices in this cluster:

- [Infra](#Infra)
- [Docker](#Docker)
- [Jenkins](#Jenkins)
- [Kubernetes](#Kubernetes)
- [Cluster architecture](#Cluster architecture)
- [Monitoring](#Monitoring)

## Infra

We deploy our infrastructure with terraform in vcenter with provider ``vsphere``. In ``variables.tf``, you makre sure to declare all necessairy varibale such as **vsphereuser** and **vspherepass**.

## Docker

In the ``docker`` section, you find multiple directory that contain ``Dockerfile`` for each microservice that are deployed in the next section. After building the microservices with **Jenkins**, we use **nginx image** to build images with the specific microservices name for each image (It recommended to use nginx or apache as reverse proxy in production environment). You find nomination in the ``Jenkinsfile`` in [Jenkins](#Jenkins) section for each microservice.

## Jenkins

In the **Jenkins** section, you find a ``Jenkinsfile`` that have multiple stages: 

- Initialize Project to Build
- Build Project: build react microservice with command ``npm run build`` and generate the **build** directory (we can separate deployment and building for each microservice)
- Build project images for dockerhub
- Push the docker image to private hub: this stage is comment (you should make your own creadention in this stage)
- Deploy devops-test-oualid on remote K8S cluster

Note that test section is not implemented. Usually test are implemented with the developper.

## Kubernetes

In the **kubernetes** section, we will find ``yaml`` file to:

- Install component of kubernetes with on all nodes: kubeadm, kubelet... ``install_k8s.yaml`` with **ansible**.
- Create user  to manage our cluster ``create_user_k8s.yml`` with **ansible**.
- ``init`` command on the master node ``init_k8s.yaml`` with **ansible**.
- ``joint`` command on the workers nodes ``join_workers.yaml`` with **ansible**.
- Create specific namespace to deploy microservices ``namespace_devops_test.yaml`` with ``kubeclt`` command.
- The deploy yaml file of microservice ``deploy-devops-test-oualid.yaml`` with ``kubectl`` command.

Note that **service_k8s_to_app** is for creation of services **svc** to point on microservices. We use ``clusterIp`` service to expose our ``pod`` on the cluster.
To expose our final application, we use ``nginx ingress`` or ``nodePort`` service. (To use Nginx ingress, you should deploy nginx ingress controller from the *[officiel website](https://docs.nginx.com/nginx-ingress-controller/installation/installation-with-manifests)*).

## Cluster architecture
![image](https://user-images.githubusercontent.com/65124955/227773329-67af1834-89d8-43c0-8970-c77fc430facc.png)

## Monitoring

We use **prometheus** and **grafana**  to monitore our cluster. All configuration are stored in ``configMap`` object of kubernetes moutend as configuration file on kubernetes ``deployment``. You find the ``configMap`` and the ``deployment`` files in the monitoring directory.


