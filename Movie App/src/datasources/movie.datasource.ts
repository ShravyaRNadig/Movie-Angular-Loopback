import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Movie',
  connector: 'memory',
  localStorage: '',
  file: './data/movie'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MovieDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Movie';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Movie', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
