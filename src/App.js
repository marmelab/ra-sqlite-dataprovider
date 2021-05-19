import React, { useState, useEffect } from 'react'
import { Admin, Resource, ListGuesser, Loading } from 'react-admin'
import { createDbWorker } from 'sql.js-httpvfs'

import dataProviderFactory from './dataProvider';
import repositories from './repositories';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
)
const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm', import.meta.url)
const config = {
  from: "inline",
  config: {
    serverMode: "full", // file is just a plain old full sqlite database
    requestChunkSize: 4096, // the page size of the  sqlite database (by default 4096)
    url: process.env.DB_URL // url to the database (relative or full)
  }
};

const App = () => {
  const [dataProvider, setDataProvider] = useState(null);

  useEffect(() => {
    const startDataProvider = async () => {
      const worker = await createDbWorker(
        [config],
        workerUrl.toString(), wasmUrl.toString()
      );
      setDataProvider(dataProviderFactory(worker));
    }
    if (dataProvider === null) {
      startDataProvider();
    }
  }, [dataProvider]);

  if (dataProvider === null) {
    return <Loading />
  }

  return (
    <Admin dataProvider={dataProvider} title="ra-sqlite-dataprovider">
      <Resource {...repositories} />
    </Admin>
  )
}

export default App
