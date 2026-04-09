export const getStyles = ({ navClass }: { navClass?: string }) => {
    return {
        ul: `flex flex-col md:flex-row gap-4 ${navClass}`,
    };
};
