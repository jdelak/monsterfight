import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super({ key: 'Boot' });
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background1', 'assets/images/pokemon_background.png');
    }

    create ()
    {
        this.add.image(0, 0, 'background1').setOrigin(0,0);
        this.scene.start('Preloader');

        this.input.once('pointerdown', () => {

            this.scene.start('Preloader');

        });
    }
}
