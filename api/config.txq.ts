const txqConfig = {
  type: "txeventq" as const,
  connectString:
    "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g0a7523bd2f0a8f_gas3p3tsba5e6jch_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))",
  user: "txeventq_user",
  password: "FBKBwFb1dSrH",
  instantClientPath: "../driver/instantclient_23_9",
};

export default txqConfig;
