alert("sus");
const Pulsar = require('pulsar-client');

(async () => {
  // Token based authentication
  const tokenStr = YOUR_PULSAR_TOKEN;
  const pulsarUri = 'pulsar+ssl://pulsar-gcp-useast1.streaming.datastax.com:6651';
  const topicName = 'persistent://mister0sus/default/online-game';

  // CentOS RHEL:
  // const trustStore = '/etc/ssl/certs/ca-bundle.crt';
  // Debian Ubuntu:
  // const trustStore = '/etc/ssl/certs/ca-certificates.crt'

  const auth = new Pulsar.AuthenticationToken({token: tokenStr});

  // Create a client
   const client = new Pulsar.Client({
    serviceUrl: pulsarUri,
    authentication: auth,
    // tlsTrustCertsFilePath: trustStore,
    operationTimeoutSeconds: 30,
  });

  // Sets log handler
  Pulsar.Client.setLogHandler((level, file, line, message) => {
    console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
  });

  // Create a reader
  const reader = await client.createReader({
    topic: topicName,
    startMessageId: Pulsar.MessageId.earliest(),
  });

  for (let i = 0; i < 1000; i += 1) {
    console.log((await reader.readNext()).getData().toString());
  }
  await reader.close();
  await client.close();
})();
