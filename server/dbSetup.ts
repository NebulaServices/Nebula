import chalk from "chalk";
import { CatalogModel, Catalog } from "./server.js";
import { ModelStatic } from "sequelize";
import { fileURLToPath } from "node:url";
import ora from 'ora';

interface Items extends Omit<Catalog, "background_video" | "background_image"> {
    background_video?: string
    background_image?: string
}

async function installItems(db: ModelStatic<CatalogModel>, items: Items[]) {
    items.forEach(async (item) => {
        await db.create({
            package_name: item.package_name,
            title: item.title,
            image: item.image,
            author: item.author,
            version: item.author,
            description: item.description,
            tags: item.tags,
            payload: item.payload,
            background_video: item.background_video,
            background_image: item.background_image,
            type: item.type
        });
    });
}

async function setupDB(db: ModelStatic<CatalogModel>) {
    //We have some packages that need to be installed if they aren't.
    const items: Items[] = [
        { 
            package_name: 'com.nebula.gruvbox', 
            title: 'Gruvbox', 
            image: 'com.nebula.gruvbox.jpeg',
            author: 'Nebula Services',
            version: '1.0.0',
            description: 'The gruvbox theme',
            tags: ["Theme", "Simple"],
            payload: "com.nebula.gruvbox.css",
            type: 'theme'
        }
    ]
    const dbItems = await db.findAll();
    if (dbItems.length === 0) {
        const spinner = ora(chalk.hex('#7967dd')('Performing DB setup...')).start();
        await installItems(db, items);
        spinner.succeed(chalk.hex('#eb6f92')('DB setup complete!'));
    }
}

export { setupDB }
