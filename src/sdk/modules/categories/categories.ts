import Categories from './Categories.json';

type Category = {
    name: string;
    children?: Category[];
}

export const getCategories = (): Category[] => {
    return Categories as Category[];
}

export const getCategoryNamesFlatList = (): string[] => {
    const categories = getCategories();
    const flatList: string[] = [];
    
    const traverse = (category: Category) => {
        flatList.push(category.name);
        if (category.children) {
            category.children.forEach(traverse);
        }
    };

    categories.forEach(traverse);
    return flatList;
}