import { OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { switchMap, tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DAO } from "./dao";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";

export class List<T> implements OnInit, OnDestroy {
  public ngUnsubscribe = new Subject();
  public objects: T[];
  public dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    public service: DAO<T>,
    public router: Router,
    public displayedColumns: string[]
  ) { }

  ngOnInit() {
    this.customSorting();
    this.dataSource.sort = this.sort;
    // this.sort.sortChange.subscribe(sort => console.log(sort));
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSize = 10;

    this.service
      .getAll()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(objects => {
          console.log(`${this.service.collectionName} : `, objects);
          this.objects = objects;
        })
      )
      .subscribe((objects: T[]) => (this.dataSource.data = objects));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  customSorting() { }

  onAction(action: string, object: T) {
    let id = "";
    if (object) {
      id = object["id"];
      this.service.setSelectedObject(object);
    }
    this.router.navigate(['admin', this.service.collectionName, action, id]);
  }
}
