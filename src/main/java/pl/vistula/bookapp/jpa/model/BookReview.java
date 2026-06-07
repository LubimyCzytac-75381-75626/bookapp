package pl.vistula.bookapp.jpa.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private BookReview parent;

    @OneToMany(mappedBy = "parent", 
               cascade = CascadeType.REMOVE, 
               orphanRemoval = true, 
               fetch = FetchType.LAZY)
    @Builder.Default
    private List<BookReview> children = new ArrayList<>();
}
