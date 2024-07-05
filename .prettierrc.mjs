export default {
    printWidth: 80,
    singleQuote: true,
    trailingComma: "all",
    bracketSpacing: true,
    tabWidth: 4,
    semi: true,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    plugins: [import("@trivago/prettier-plugin-sort-imports")],
};
