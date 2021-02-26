export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      http: {
        method: 'options',
        path: 'helloWorld',
      },
    },
    {
      http: {
        method: 'get',
        path: 'helloWorld',
      },
    },
    {
      http: {
        method: 'post',
        path: 'helloWorld',
      },
    },
  ],
};
