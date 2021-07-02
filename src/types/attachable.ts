import { PlayerInstance } from "@nodepolus/framework/src/api/player";
import { Player } from "@nodepolus/framework/src/player";
import { EntityPlayer, InnerCustomNetworkTransform } from "@nodepolus/framework/src/protocol/entities/player";
import { EntityDeadBody, EntityPointOfInterest } from "../entities";
import { EntityConsole } from "../entities/entityConsole";
import { EntityLightSource } from "../entities/entityLightSource";
import { EntitySoundSource } from "../entities/entitySoundSource";
import { EntityVent } from "../entities/entityVent";
import { InnerCustomNetworkTransformGeneric } from "../innerNetObjects/innerCustomNetworkTransformGeneric";

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
