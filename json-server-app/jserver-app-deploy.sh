# #!/usr/bin/env bash


export NAMESPACE="${NAMESPACE:-apic-systest-app}"
export K8S_CLUSTER="${K8S_CLUSTER:-apictestapp.apicsystest.axwaytest.net}"
export KOPS_STATE_STORE="s3://${S3_BUCKET:-systest-apic-kops-state}"


echo "checking if kubectl present"

if ! hash kubectl 2>/dev/null
then
    echo "'kubectl' was not found in PATH"
    echo "Kindly ensure that you can acces an existing kubernetes cluster via kubectl"
    exit
fi

if ! hash kops 2>/dev/null
then
    echo "'kops' was not found in PATH"
    echo "Kindly ensure that you can acces an existing kubernetes cluster via kops"
    exit
fi

kubectl version --short
kops version

#Export the kubenerties cluster 
kops export kubecfg "$K8S_CLUSTER"

#Check If namespace exists
kubectl get namespace $NAMESPACE > /dev/null 2>&1

if [ $? -eq 0 ]
then
  echo "Namespace $NAMESPACE already exists, please select a unique name"
  echo "Deploying json-server-app in $NAMESPACE"
  sleep 2
  kubectl create -R -f kube-deploy/ -n $NAMESPACE
 # kubectl get namespaces | grep -v NAME | awk '{print $1}'
 #  exit 1
else
  echo "Creating Namespace: $NAMESPACE"
  kubectl create namespace $NAMESPACE
  kubectl create -R -f kube-deploy/ -n $NAMESPACE
fi




#################################################################################################
# Wait for the elb creation for Grafana and Nginx
#################################################################################################

 _timeout=600
 SECONDS=0

echo "waiting for the elb creation for grafana"
until [ "$(kubectl get svc nginx-proxy-js -n $NAMESPACE --no-headers -owide | awk '{print $4}')" != "<pending>" ]; do
	echo -n "."
	sleep 1
	if [ $SECONDS -gt $_timeout ]; then
	  echo " timeout reached"
	  return 1
	fi
done

kubectl get -n $NAMESPACE all


sleep 10

pod_name="$(kubectl get pods -n $NAMESPACE --no-headers -owide | awk '{print $1}' | grep nginx-proxy-js)"
 
echo "Updating nginx with port 80 for json-server-app and reload nginx "
kubectl exec $pod_name rm /etc/nginx/sites-available/default -n $NAMESPACE
kubectl cp default $pod_name:/etc/nginx/sites-available/default -n $NAMESPACE
kubectl exec $pod_name -n $NAMESPACE -- nginx -s reload

#################################################################################################
# Update Route53 Records with Latest ELB ids from Grafana and Ngnix-InfluxDB ELBs
#################################################################################################


ret=$?

if [[ $ret -eq 0 ]]; then
    echo "Updating the DNS for json-server-app with newly created ELBs"
    # The CNAME you want to update e.g. abc.example.com
    RECORDSET_JSERVERAPP="jsonserver.apicsystest.axwaytest.net."
    # Extracting the ELB records from service name for json-server-app service.
    JSERVERAPP_ELB="$(kubectl get svc nginx-proxy-js -n $NAMESPACE --no-headers -owide | awk '{print $4}')"

    ZONEID=Z1YWA6KKX2YNYD
    
    export JSERVERAPP_ELB 

    # The Time-To-Live of this recordset
    TTL=300
    # Change this if you want
    COMMENT="Auto updating @ $(date)"
    # Change to AAAA if using an IPv6 address
    TYPE="CNAME"
    # Fill a temp file with valid JSON
    TMPFILE=$(mktemp ./temporary-file.XXXXXXXX)
    cat > "${TMPFILE}" << EOF
    {
      "Comment":"$COMMENT",
      "Changes":[
        {
          "Action":"UPSERT",
          "ResourceRecordSet":{
            "ResourceRecords":[
              {
                "Value":"$JSERVERAPP_ELB"
              }
            ],
            "Name":"$RECORDSET_JSERVERAPP",
            "Type":"$TYPE",
            "TTL":$TTL
          }
        }
      ]
    }
EOF
    # Update the Hosted Zone record
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$ZONEID" \
        --change-batch "file://$TMPFILE"
    # Clean up
    rm "$TMPFILE"
else
    echo "An error occured during chart deployment, exiting"
    exit 1
fi
echo "ELB may take couple of minutues to be available.... "
