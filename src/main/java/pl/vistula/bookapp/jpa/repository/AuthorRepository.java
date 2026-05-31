package pl.vistula.bookapp.jpa.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import pl.vistula.bookapp.jpa.model.Author;


public interface AuthorRepository extends JpaRepository<Author, Long> {
}
