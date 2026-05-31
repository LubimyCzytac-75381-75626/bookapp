package pl.vistula.bookapp.jpa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import lombok.extern.jackson.Jacksonized;

@Entity
@Table(name = "book_review")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Accessors(chain=true)
@Jacksonized
public class BookReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    Book book;

    @Column(name = "user_name")
    String userName;

    @Column(name = "grade")
    Integer grade;
    
    @Column(name = "review_text")
    String reviewText; 
}
