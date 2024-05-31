import { CHART_TYPE } from "@prisma/client";

export class ChartDto {
  id: number;
  databaseId: string;
  folderId: number;
  title: string;
  type: CHART_TYPE;
  order: number;
  createdAt: Date;
  updateAt: Date;
}