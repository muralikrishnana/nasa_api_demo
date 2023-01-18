// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NASA_API_COMPLIANT_DATE_FORMAT } from '@/src/misc/constants';
import { APOD_Request_Data, NASA_API_Response, Success_Based_Response } from '@/src/types/nasa-api';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.NASA_API_KEY;

const getAPODUrl = (data: APOD_Request_Data) => {
  return `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${data.startDate}&end_date=${data.endDate}&thumbs=true`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Success_Based_Response<NASA_API_Response[]>>,
) {
  const { query } = req;

  const startDate = (query.startDate as string) ?? moment().format(NASA_API_COMPLIANT_DATE_FORMAT);
  const endDate = (query.endDate as string) ?? moment().format(NASA_API_COMPLIANT_DATE_FORMAT);

  try {
    const apodAPIResponse = await (
      await fetch(
        getAPODUrl({
          startDate,
          endDate,
        }),
      )
    ).json();

    if (Array.isArray(apodAPIResponse))
      return res.status(200).json({
        success: true,
        data: apodAPIResponse,
      });

    res.status(200).json({
      success: false,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
    });
  }

  res.end();
}
