kops create cluster \
    --name=apictestapp.apicsystest.axwaytest.net \
    --zones=us-west-2a \
    --master-size=t2.medium \
    --node-size=t2.medium \
    --node-count=2 \
    --master-count=1 \
    --ssh-public-key=/home/kalyan/.ssh/id_rsa.pub \
    --kubernetes-version=1.9.3 \
    --network-cidr=172.34.0.0/16 \
    --cloud-labels=axway:billing=infra__apicentral__kubernetes,axway:environment=apictestapp \
    --topology=private \
    --image=934549265897/ecd-centos-image-v3 \
    --networking=calico \
    --logtostderr --v 2

kops update cluster     --yes


kops create cluster \
    --name=jmeter.apicsystest.axwaytest.net \
    --zones=us-west-2a \
    --master-size=t2.medium \
    --node-size=t2.medium \
    --node-count=2 \
    --master-count=1 \
    --ssh-public-key=/home/kalyan/.ssh/id_rsa.pub \
    --kubernetes-version=1.9.3 \
    --network-cidr=172.36.0.0/16 \
    --cloud-labels=axway:billing=infra__apicentral__kubernetes,axway:environment=apictestapp \
    --topology=private \
    --image=934549265897/ecd-centos-image-v3 \
    --networking=calico \
    --logtostderr --v 2

kops update cluster jmeter.apicsystest.axwaytest.net --yes