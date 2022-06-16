import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';
// import { useListChannelsQuery } from '../../../redux/api/channels';
import { fetchChannels } from '../../../services/channels';

interface ChannelsSelectProps extends SelectProps<number> {}

const ChannelsSelect: React.FC<ChannelsSelectProps> = (selectProps) => {
  // const { data, isFetching } = useListChannelsQuery();
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetchChannels();
      setLoading(false);

      if (res) {
        setData(res);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Select
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...selectProps}
      loading={loading}
      dropdownStyle={data ? {} : { height: 0 }}
      onDropdownVisibleChange={() => {
        if (!data) {
          getData();
        }
      }}
    >
      {data &&
        data.map((channel) => (
          <Select.Option key={channel.channelNum} value={channel.channelNum}>
            {channel.channelName}
          </Select.Option>
        ))}
    </Select>
  );
};

export default ChannelsSelect;
