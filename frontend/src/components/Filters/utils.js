export const getOptionsAndMapAreas = (data) => {
  console.log("🚀 ~ getOptionsAndMap ~ data:", data?.data?.features);
  const options = [];
  const map = new Map();
  data?.data?.features?.forEach((item) => {
    options.push(item?.properties.attributes.Address);
    map.set(
      item?.properties.attributes.Address,
      item?.properties.attributes.Address
    );
  });

  return { options, map };
};

export const getOptionsAndMap = (data) => {
  console.log("🚀 ~ getOptionsAndMap ~ data:", data?.data?.features);
  const options = [];
  const map = new Map();
  data?.data?.features?.forEach((item) => {
    options.push(item?.properties.attributes.Address);
    map.set(
      item?.properties.attributes.Address,
      item?.properties.attributes.Address
    );
  });

  return { options, map };
};

export const getFilterOptions = (data) => {
  const options = [];
  const map = new Map();
  data.data.forEach((item) => {
    options.push(item.title);
    map.set(item.title, {
      description: item.description,
      key: item.key,
    });
  });

  return { options, map };
};

export const formatCrossingFilters = (data) => {
  const formattedObject = {};
  Object.keys(data).forEach((option) => {
    const radioValue = data[option]?.value;
    formattedObject[option] = radioValue;
  });
  return formattedObject;
};
