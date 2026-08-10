import { Component, input } from '@angular/core';

@Component({
  selector: 'tms-analytics-chart',
  imports: [],
  templateUrl: './analytics-chart.html',
  styleUrls: ['./analytics-chart.scss'],
})
export class AnalyticsChart {
  data = input.required();
}
