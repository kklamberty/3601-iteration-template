import { Component, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { User } from './user';
import { UserCardComponent } from './user-card.component';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [UserCardComponent, MatCardModule]
})
export class UserProfileComponent {
  user_or_error: Signal<User | { help: string, httpResponse: string, message: string }> = toSignal(this.userService.getUserById(this.route.snapshot.paramMap.get('id')));
  user: Signal<User> = computed(() => {
    if (this.isUser(this.user_or_error())) {
      return this.convertToUser(this.user_or_error());
    }
  });
  error: Signal<{ help: string, httpResponse: string, message: string }>
    = computed(() => {
      if (this.isError(this.user_or_error())) {
        return this.convertToError(this.user_or_error());
      }
    });

  isUser(obj: User | { help: string, httpResponse: string, message: string }): obj is User {
    console.log(obj);
    return obj && '_id' in obj && 'name' in obj && 'age' in obj && 'company' in obj && 'email' in obj && 'role' in obj;
  }

  convertToUser(obj: User | { help: string, httpResponse: string, message: string }): User {
    if (this.isUser(obj)) {
      return obj as User; // Assertion if type guard is true
    }
    throw new Error('Object does not match User interface');
  }

  isError(obj: User | { help: string, httpResponse: string, message: string }): obj is { help: string, httpResponse: string, message: string } {
    // Has the structure of our error type, with `help`, `httpResponse`, and `message` fields.
    return obj && 'help' in obj && 'httpResponse' in obj && 'message' in obj;
  }

  convertToError(obj: User | { help: string, httpResponse: string, message: string }): { help: string, httpResponse: string, message: string } {
    if (this.isError(obj)) {
      return obj as { help: string, httpResponse: string, message: string }; // Assertion if type guard is true
    }
    throw new Error('Object does not match error interface');
  }

  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private userService: UserService) { }
}
