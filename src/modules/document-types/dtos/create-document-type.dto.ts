import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentTypeDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;
}
