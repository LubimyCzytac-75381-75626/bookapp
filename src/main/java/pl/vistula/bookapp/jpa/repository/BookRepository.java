package pl.vistula.bookapp.jpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.vistula.bookapp.jpa.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthorsId(Long authorId);
    List<Book> findByCategoriesId(Long categoryId);
}
