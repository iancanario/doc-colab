import { IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentType {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;
}