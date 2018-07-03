

ret=$?

if [[ $ret -eq 0 ]]; then
    echo "Updating the DNS for Admin and Consumer with newly created ELBs"
    # The CNAME you want to update e.g. abc.example.com
    RECORDSET_APP="apictestapp.apicsystest.axwaytest.net."
    # Extracting the ELB records from service name for both nginx-admin and nginx-consumer service.
    APP_ELB="$(kubectl get svc todo-service -n apic-systest-app --no-headers -owide | awk '{print $4}')"
    ZONEID=Z1YWA6KKX2YNYD
    
    export APP_ELB
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
                "Value":"$APP_ELB"
              }
            ],
            "Name":"$RECORDSET_APP",
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