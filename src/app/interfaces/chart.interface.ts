

export interface ChartOptions {
  responsive: boolean;
  scales: {
    y: {
      beginAtZero: boolean;
    };
  };
  plugins?: {
    legend?: {
      display: boolean;
      position: 'top' | 'left' | 'bottom' | 'right';
    };
    tooltip?: {
      enabled: boolean;
    };
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}


