import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Contact } from '../models/contact';
import { ContactListService } from '../services/contact-list.service';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, OnDestroy {

  public readonly COLUMNS = [
    'name',
    'url',
    'kebab'
  ];

  public initialContactList: Contact[] = [];
  public contactCount: any = 10;
  private resultObserver: Subscription = new Subscription();
  private resultCountObserver: Subscription = new Subscription();
  public tableDataSource: MatTableDataSource<Contact> = new MatTableDataSource<Contact>([]);
  private pageIndex = 0;
  private pageSize = 10;
  public searchName = '';

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
  }


  constructor(private contactListService: ContactListService,
    private dialog: MatDialog) { }

  ngOnDestroy(): void {
    if (this.resultObserver) {
      this.resultObserver.unsubscribe();
    }
    if (this.resultCountObserver) {
      this.resultCountObserver.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.loadContactData();
    this.loadContactCount();
  }

  private loadContactCount() {
    this.resultCountObserver = this.contactListService.getContactCount().subscribe(data => {
      this.contactCount = data;
    });
  }

  private loadContactData() {
    this.resultObserver = this.contactListService.getContactList(this.pageIndex, this.pageSize, this.searchName).subscribe(data => {
      this.tableDataSource.data = data;
    });
  }

  public viewImage(element: Contact) {
    window.event?.stopPropagation();
    const dialogRef = this.dialog.open(ContactDialogComponent,{
      data:{
        name: element.name,
        url: element.url
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      window.event?.stopPropagation();
    });
  }

  public onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadContactData();
  }

  public applyFilter(){
    this.loadContactData();
  }

  public clearFilter(){
    this.searchName='';
    this.loadContactData();
  }

}
