
import Handler = laya.utils.Handler;
import Texture = laya.resource.Texture;
import Loader = laya.net.Loader;
import Sprite = laya.display.Sprite;

class Main extends laya.display.Sprite {
	constructor() {
		super();
		Laya.loader.load("c.png", Handler.create(this, this.onResDone) );
	}
	
	onResDone():void {
		var pic1: Texture = Loader.getRes("c.png");
		this.graphics.drawTexture(pic1,0,0);
	}
}

Laya.init(640,1066);
Laya.stage.scaleMode = 'fixedwidth'
Laya.stage.addChild(new Main());
