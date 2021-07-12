import { PlayerInstance } from "../api/player";
import { Player } from "../player";
import { EntityPlayer, InnerCustomNetworkTransform } from "../protocol/entities/player";
import { EntityDeadBody } from "../protocol/polus/entities/entityDeadBody";
import { EntityPointOfInterest } from "../protocol/polus/entities/entityPointOfInterest";
import { EntityConsole } from "../protocol/polus/entities/entityConsole";
import { EntityLightSource } from "../protocol/polus/entities/entityLightSource";
import { EntitySoundSource } from "../protocol/polus/entities/entitySoundSource";
import { EntityVent } from "../protocol/polus/entities/entityVent";
import { InnerCustomNetworkTransformGeneric } from "../protocol/polus/innerNetObjects/innerCustomNetworkTransformGeneric";

export type Attachable = Player
| PlayerInstance
| EntityPlayer
| InnerCustomNetworkTransform
| InnerCustomNetworkTransformGeneric
| EntityConsole
| EntityLightSource
| EntityPointOfInterest
| EntityDeadBody
| EntitySoundSource
| EntityVent;
