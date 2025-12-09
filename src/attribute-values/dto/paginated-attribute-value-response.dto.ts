import { AttributeValue } from '../entities/attribute-value.entity';

export class PaginatedAttributeValueResponseDto {
  attribueValues: AttributeValue[];
  total: number;
}
