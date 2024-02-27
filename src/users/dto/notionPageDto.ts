import { IsEmail, IsNotEmpty } from 'class-validator';

export class NotionMainPageDto {
  @IsNotEmpty()
  readonly notionPageId: string;
}
