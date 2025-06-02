import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mat-table',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
  templateUrl: './mat-table.component.html',
  styles: ``
})
  export class MatTableComponent {
    @Input() data: Record<string, any>[] = [];
    @Input() columns: { key: string, label: string }[] = [];
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();

  dataSource = new MatTableDataSource<Record<string, any>>();
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(col => col.key as string);
    this.dataSource.data = this.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
