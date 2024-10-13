import chalk from "chalk";
import { CatalogModel } from "./server.js";
import { ModelCtor } from "sequelize";

function setupDB(db: ModelCtor<CatalogModel>) {
    //We have some packages that need to be installed if they aren't.
    //TODO: set this up
    console.log(chalk.hex('#7967dd')('Performing DB setup...'));
    //db.create({
    //    package_name: 'com.nebula.cybermonay',
    //    title: 'Cyber Monay',
    //    image: 'cyber_monay.jpg',
   //     author: 'Nebula Services',
   //     version: '1.0.0',
   //     description: 'A parody of the famous "Cyber Monay" hack!',
   //     tags: ["Hacking", "Animated", "Funny"],
   //     payload: "com.nebula.cybermonay.css",
   //     background_video: "cyber_monay_test.mp4",
   //     type: 'theme'
    //});
}

export { setupDB }
