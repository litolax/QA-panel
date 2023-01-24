import ReportType from './types/ReportType';

export namespace Utils {
	export function cleanup<T = unknown>(data: T): T {
		return JSON.parse(JSON.stringify(data)) as T;
	}

	export function getReportTypeColor(type: ReportType): string {
		switch (type) {
			case ReportType.acceptOtherReport:
				return 'geekblue';
			case ReportType.adminHelp:
				return 'green';
			case ReportType.devHelp:
				return 'purple';
			case ReportType.problem:
				return 'red';
			case ReportType.cooperation:
				return 'pink';
			case ReportType.online:
				return 'yellow';
			default:
				return '';
		}
	}
}
