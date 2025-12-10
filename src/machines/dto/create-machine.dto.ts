import { AttributeValue } from 'src/attribute-values/entities/attribute-value.entity';
import { Connector } from 'src/connectors/entities/connector.entity';

export class CreateMachineDto {
  id: number;
  description: string;
  serial: string;
  model: string;
  connector: Connector;
  attributeValues: AttributeValue[];
}
