import React from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
    message: string;
    children: React.ReactNode;
}

const Tooltip = ({ message, children }: TooltipProps) => {
    return (
        <div className={styles.tooltipContainer}>
            {children}
            <span className={styles.tooltipText}>{message}</span>
        </div>
    );
};

export default Tooltip;
