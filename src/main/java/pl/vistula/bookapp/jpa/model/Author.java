package pl.vistula.bookapp.jpa.model;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import lombok.extern.jackson.Jacksonized;


@Entity
@Table(name = "author")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Accessors(chain=true)
@Jacksonized
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "name")
    String name;

    @Column(name = "biography")
    String biography;

    // @ManyToMany
    // @JoinTable(
    //     name = "book_authors", 
    //     joinColumns = @JoinColumn(name = "author_id"), 
    //     inverseJoinColumns = @JoinColumn(name = "book_id"))
    // @Builder.Default
    // List<Book> books = new ArrayList<>();
}
