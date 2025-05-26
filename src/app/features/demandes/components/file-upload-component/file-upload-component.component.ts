import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-file-upload-component",
  template: `
    <div class="file-upload-container">
      <label class="form-label">{{ label }}</label>

      <div
        *ngIf="!control.value"
        class="upload-area"
        (click)="fileInput.click()"
      >
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload or drag and drop</p>
        <input
          #fileInput
          type="file"
          [accept]="accept"
          (change)="onFileSelected($event)"
          style="display: none;"
        />
      </div>

      <div *ngIf="control.value" class="file-preview">
        <div class="file-info">
          <i class="fas" [ngClass]="getFileIcon()"></i>
          <div>
            <p class="file-name">{{ fileName }}</p>
            <p class="file-size">{{ fileSize }}</p>
          </div>
        </div>
        <div class="file-actions">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            (click)="fileInput.click()"
          >
            Replace
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            (click)="removeFile()"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./file-upload-component.component.scss"],
})
export class FileUploadComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() accept = "*";
  @Output() fileChange = new EventEmitter<File>();

  fileName = "";
  fileSize = "";

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.updateFileInfo(file);
      this.control.setValue(file);
      this.fileChange.emit(file);
    }
  }

  removeFile(): void {
    this.fileName = "";
    this.fileSize = "";
    this.control.setValue(null);
    this.fileChange.emit(null);
  }

  private updateFileInfo(file: File): void {
    this.fileName = file.name;
    this.fileSize = this.formatFileSize(file.size);
  }

  getFileIcon(): string {
    if (!this.fileName) return "fa-file";
    const ext = this.fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "fa-file-pdf";
      case "doc":
      case "docx":
        return "fa-file-word";
      case "xls":
      case "xlsx":
        return "fa-file-excel";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "fa-file-image";
      default:
        return "fa-file";
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toString() +
      " " +
      sizes[i]
    );
  }
}
