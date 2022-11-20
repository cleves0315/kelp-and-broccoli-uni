export type UseLogOptions = {
  color?: string;
  bkColor?: string;
  icon?: string;
};

export type Log = (message?: any, ...optionalParams: any[]) => void;

export type LogGroup = (...label: any[]) => void;

/**
 * 美化 console.log
 */
export const useLog = (options?: UseLogOptions): [Log] => {
  const styles_1 = `
    color: ${options?.color || '#fff'};
    border-radius: 3px;
    padding: ${options?.icon ? '2px 2px' : '1px'};
    background-color: ${options?.bkColor || '#41b883'};
    background-image: url(${options?.icon ? options?.icon : ''});
    background-repeat: no-repeat;
    background-position: center left;
    background-size: 20px 20px;
  `;

  const log = (message?: any, ...optionalParams: any[]) => {
    console.log(`%c${options?.icon ? '   ' : ''}${message}`, styles_1, ...optionalParams);
  };

  return [log];
};

/**
 * 美化 console.group
 */
export const useGroup = (options?: UseLogOptions): [LogGroup, Console['groupEnd']] => {
  const styles_1 = `
    color: ${options?.color || '#fff'};
    border-radius: 3px;
    padding: ${options?.icon ? '2px 2px' : '1px'};
    background-color: ${options?.bkColor || '#41b883'};
    background-image: url(${options?.icon ? options?.icon : ''});
    background-repeat: no-repeat;
    background-position: center left;
    background-size: 20px 20px;
  `;

  const group = (...label: any[]) => {
    console.group(`%c${options?.icon ? '   ' : ''}${label.join('')}`, styles_1);
  };

  return [group, console.groupEnd];
};

/**
 * 美化 console.groupCollapsed
 */
export const useGroupCollapsed = (options?: UseLogOptions): [LogGroup, Console['groupEnd']] => {
  const styles_1 = `
    color: ${options?.color || '#fff'};
    border-radius: 3px;
    padding: ${options?.icon ? '2px 2px' : '1px'};
    background-color: ${options?.bkColor || '#41b883'};
    background-image: url(${options?.icon ? options?.icon : ''});
    background-repeat: no-repeat;
    background-position: center left;
    background-size: 20px 20px;
  `;

  const groupCollapsed = (...label: any[]) => {
    console.groupCollapsed(`%c${options?.icon ? '   ' : ''}${label.join('')}`, styles_1);
  };

  return [groupCollapsed, console.groupEnd];
};
