export const getDataSources = appId => {
  const getOptions = { attributes: 'id,name,accessRules,columns,appId,definition', type: null };

  if (appId) {
    getOptions.appId = appId;
    getOptions.includeInUse = true;
    getOptions.excludeTypes = 'bookmarks,likes,comments,menu';
  }

  return Fliplet.DataSources.get(getOptions);
};

export const getDataSource = dataSourceId => {
  return Fliplet.DataSources.getById(dataSourceId, { cache: false, attributes: 'id,name,accessRules,columns,definition' });
};

export const createDataSource = (data, context) => {
  return Fliplet.Modal.prompt({
    title: 'Enter a name for the data source',
    value: _.get(data, 'default.name', '')
  })
    .then(dataSourceName => {
      if (dataSourceName === null) {
        return;
      }

      if (!dataSourceName) {
        return Fliplet.Modal.alert({
          message: 'Data source name can\'t be empty. Please enter a data source name.'
        })
          .then(() => {
            return createDataSource(data);
          });
      }

      context.isLoading = true;

      const createOptions = {
        name: dataSourceName,
        appId: data.appId
      };

      const entries = _.get(data, 'default.entries', []);
      const columns = _.get(data, 'default.columns', []);

      if (entries.length) {
        createOptions.entries = entries;
      }

      if (columns.length) {
        createOptions.columns = columns;
      }

      return Fliplet.DataSources.create(createOptions);
    });
};

export const updateDataSourceSecurityRules = (dataSourceId, securityRules) => {
  return Fliplet.DataSources.update(dataSourceId, { accessRules: securityRules });
};
