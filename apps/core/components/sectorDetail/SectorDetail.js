// @flow

import * as React from 'react';
import { graphql, createFragmentContainer } from '@kiwicom/margarita-relay';

import Segment from './segment/Segment';
import SectorHeader from './SectorHeader';
import LayoverInfo from './LayoverInfo';
import SectorStopoverDuration from './SectorStopoverDuration';
import type { SectorDetail as SectorType } from './__generated__/SectorDetail.graphql';

type Props = {|
  +data: ?SectorType,
|};

const SectorDetail = (props: Props) => {
  const segmentsData = props.data?.segments ?? [];
  const segments = segmentsData.map((data, index) => {
    if (data) {
      const addLayoverInfo = index < segmentsData.length - 1;
      return (
        <React.Fragment key={data.id}>
          <Segment data={data} />
          {addLayoverInfo && (
            <LayoverInfo
              startTime={data.arrival?.time?.local}
              endTime={segmentsData[index + 1]?.departure?.time?.local}
            />
          )}
        </React.Fragment>
      );
    }
    return null;
  });

  return (
    <>
      <SectorStopoverDuration data={props.data} />
      <SectorHeader data={props.data} />
      {segments}
    </>
  );
};

export default createFragmentContainer(
  SectorDetail,
  graphql`
    fragment SectorDetail on Sector {
      ...SectorStopoverDuration
      ...SectorHeader
      segments {
        id
        departure {
          time {
            local
          }
        }
        arrival {
          time {
            local
          }
        }
        ...Segment
      }
    }
  `,
);
